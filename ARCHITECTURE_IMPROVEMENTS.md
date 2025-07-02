# Melhorias Arquiteturais - SRP e Repository Pattern

## Resumo das Melhorias Implementadas

Este documento descreve as melhorias arquiteturais implementadas no projeto seguindo os princípios SRP (Single Responsibility Principle) e implementando uma camada repository robusta para comunicação com APIs.

## 1. **Separação de Responsabilidades (SRP)**

### Problemas Identificados:
- `WorkSessionService` misturava comunicação com API e lógica de negócio
- Stores continham lógica de negócio além de gerenciamento de estado
- Tratamento de erros inconsistente e duplicado

### Soluções Implementadas:

#### 1.1 BaseRepository
```typescript
// src/repositories/BaseRepository.ts
export abstract class BaseRepository {
  protected abstract tableName: string
  
  protected handleError(error: PostgrestError | null, operation: string): never
  protected getSupabase()
  public async getCurrentUserId(): Promise<string>
}
```

**Responsabilidades:**
- Tratamento centralizado de erros do Supabase
- Configuração comum do cliente Supabase
- Autenticação de usuário

#### 1.2 WorkSessionBusinessService
```typescript
// src/services/WorkSessionBusinessService.ts
export class WorkSessionBusinessService {
  static calculateStatistics(sessions: WorkSession[]): SessionStatistics
  static calculateWorkedTime(startTime: string, endTime: string): number
  static isSessionComplete(session: WorkSession): boolean
  static determineSessionStatus(...): 'sem_registro' | 'completa' | 'incompleta'
  static formatCreateData(...): CreateWorkSessionData
}
```

**Responsabilidades:**
- Lógica de negócio pura (sem dependências externas)
- Cálculos de tempo trabalhado
- Validações de estado de sessão
- Formatação de dados

#### 1.3 WorkSessionService Refatorado
```typescript
// src/services/WorkSessionService.ts
export class WorkSessionService {
  async startSession(date: string, time: string): Promise<WorkSession>
  async endSession(date: string, time: string): Promise<WorkSession>
  async getSessionsForMonth(...): Promise<{ sessions, total, page, totalPages }>
}
```

**Responsabilidades:**
- Orquestração entre repository e business service
- Tratamento de erros de alto nível
- Logging de operações

## 2. **Camada Repository Robusta**

### 2.1 Hierarquia de Repositories

```
BaseRepository (abstract)
├── CachedRepository (abstract)
│   └── WorkSessionRepository
├── AuthRepository
└── UserRepository
```

### 2.2 Características dos Repositories:

#### Tratamento de Erros Padronizado
```typescript
// Mapeamento de códigos de erro do Supabase
switch (error.code) {
  case 'PGRST116': // No rows returned
    throw new Error('database.notFound')
  case '23503': // Foreign key violation
    throw new Error('database.foreignKeyViolation')
  case '23505': // Unique constraint violation
    throw new Error('database.uniqueConstraintViolation')
}
```

#### Métodos Especializados
```typescript
// WorkSessionRepository
async findByUserAndPeriodPaginated(...): Promise<{ data, total }>
async countByUserAndPeriod(...): Promise<number>
async upsert(...): Promise<WorkSession>
```

### 2.3 UserRepository
Novo repository para operações de perfil de usuário:
```typescript
export class UserRepository extends BaseRepository {
  async findById(userId: string): Promise<UserProfile | null>
  async upsert(data: CreateUserData): Promise<UserProfile>
  async update(userId: string, data: UpdateUserData): Promise<UserProfile>
}
```

## 3. **Sistema de Cache Inteligente**

### 3.1 CachedRepository
```typescript
// src/repositories/CachedRepository.ts
export abstract class CachedRepository extends BaseRepository {
  protected async getCached<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T>
  public invalidateCache(key: string): void
  public invalidateCacheByPattern(pattern: string): void
  public clearCache(): void
  public getCacheStats(): { size: number; keys: string[] }
}
```

### 3.2 Estratégias de Cache
```typescript
// WorkSessionRepository com cache
async findByUserAndDate(userId: string, date: string): Promise<WorkSession | null> {
  const cacheKey = this.generateCacheKey('session', userId, date)
  return this.getCached(cacheKey, async () => {
    // Busca no banco
  }, { ttl: 2 * 60 * 1000 }) // 2 minutos
}
```

### 3.3 Invalidação Inteligente
```typescript
// Invalidar cache relacionado ao usuário
this.invalidateCacheByPattern(`session:${userId}`)
this.invalidateCacheByPattern(`sessions:${userId}`)
```

## 4. **Sistema de Validação de Dados**

### 4.1 Validator Base
```typescript
// src/lib/validation.ts
export class Validator {
  static required<T>(value: T | null | undefined, fieldName: string): ValidationResult
  static email(value: string, fieldName: string): ValidationResult
  static date(value: string, fieldName: string): ValidationResult
  static time(value: string, fieldName: string): ValidationResult
  static range(value: number, min: number, max: number, fieldName: string): ValidationResult
  static combine(...results: ValidationResult[]): ValidationResult
}
```

### 4.2 Validadores Específicos
```typescript
// WorkSessionValidator
static validateCreateData(data: CreateWorkSessionData): ValidationResult
static validateUpdateData(data: UpdateWorkSessionData): ValidationResult

// UserValidator
static validateCreateData(data: CreateUserData): ValidationResult
static validateUpdateData(data: UpdateUserData): ValidationResult
```

### 4.3 Integração nos Repositories
```typescript
// Validação automática nos métodos
async create(data: CreateWorkSessionData): Promise<WorkSession> {
  const validation = WorkSessionValidator.validateCreateData(data)
  if (!validation.isValid) {
    throw new Error(`validation.error: ${validation.errors.join(', ')}`)
  }
  // ... resto da lógica
}
```

## 5. **Sistema de Tratamento de Erros Centralizado**

### 5.1 ErrorHandler
```typescript
// src/lib/errorHandler.ts
export class ErrorHandler {
  static mapError(error: Error | string): string
  static isUserFriendly(error: Error | string): boolean
  static getSeverity(error: Error | string): 'error' | 'warning' | 'info'
  static logError(error: Error | string, context?: string): void
}
```

### 5.2 Hook useErrorHandler
```typescript
// src/hooks/useErrorHandler.ts
export function useErrorHandler() {
  const handleError = useCallback((error, context?) => void)
  const handleAsyncError = useCallback(async <T>(asyncFn, context?) => Promise<T | null>)
}
```

### 5.3 Hook useCacheManager
```typescript
// src/hooks/useCacheManager.ts
export function useCacheManager() {
  const clearWorkSessionCache = useCallback(() => void)
  const getWorkSessionCacheStats = useCallback(() => CacheStats)
  const invalidateUserSessions = useCallback((userId: string) => void)
}
```

## 6. **Refatoração de Stores**

### 6.1 SessionStore Refatorado
```typescript
// Antes: Lógica de negócio no store
startJourney: async (userId: string) => {
  // Cálculos de tempo trabalhado
  const workedHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  // Comunicação direta com repository
}

// Depois: Apenas orquestração
startJourney: async () => {
  const session = await workSessionService.startSession(today, now)
  set({ session })
}
```

**Benefícios:**
- Stores focam apenas em gerenciamento de estado
- Lógica de negócio isolada em business services
- Melhor testabilidade

## 7. **Testes Unitários**

### 7.1 Testes de Business Services
```typescript
// src/test/services/WorkSessionBusinessService.test.ts
describe('WorkSessionBusinessService', () => {
  describe('calculateStatistics', () => {
    it('should calculate statistics correctly for empty sessions', () => {
      // Teste da lógica de negócio isolada
    })
  })
  
  describe('calculateWorkedTime', () => {
    it('should handle overnight shifts', () => {
      // Teste de casos específicos
    })
  })
})
```

## 8. **Benefícios das Melhorias**

### 8.1 Performance
- **Cache inteligente**: Reduz chamadas desnecessárias à API
- **TTL configurável**: Diferentes tempos de cache por tipo de dado
- **Invalidação seletiva**: Cache é limpo apenas quando necessário

### 8.2 Manutenibilidade
- **Separação clara de responsabilidades**: Cada classe tem uma única responsabilidade
- **Código mais testável**: Lógica de negócio isolada facilita testes unitários
- **Reutilização**: Business services podem ser usados em diferentes contextos

### 8.3 Escalabilidade
- **Novos repositories**: Fácil adição seguindo o padrão BaseRepository/CachedRepository
- **Novos business services**: Lógica de negócio reutilizável
- **Tratamento de erros**: Sistema extensível para novos tipos de erro
- **Validação**: Sistema flexível para novos tipos de dados

### 8.4 Consistência
- **Padrão único**: Todos os repositories seguem a mesma estrutura
- **Tratamento de erros**: Comportamento consistente em toda a aplicação
- **Tipagem**: Interfaces bem definidas para todos os dados
- **Cache**: Estratégia uniforme de cache em toda a aplicação

## 9. **Exemplo de Uso Completo**

### 9.1 Antes (Violação do SRP)
```typescript
// Misturava comunicação com API, lógica de negócio e gerenciamento de estado
class WorkSessionService {
  async startSession(date: string, time: string) {
    const userId = await this.getUserId() // Comunicação com API
    const workedHours = calculateWorkedHours(start, end) // Lógica de negócio
    const { data, error } = await supabase.from('work_sessions') // Comunicação com API
    // ...
  }
}

// Store com lógica de negócio
const startJourney = async (userId: string) => {
  const workedHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  // ...
}
```

### 9.2 Depois (SRP Respeitado + Cache + Validação)
```typescript
// Separação clara de responsabilidades
class WorkSessionService {
  async startSession(date: string, time: string) {
    const userId = await workSessionRepository.getCurrentUserId() // Repository
    const createData = WorkSessionBusinessService.formatCreateData(...) // Business Service
    return await workSessionRepository.upsert(createData) // Repository com cache
  }
}

// Store apenas com orquestração
const startJourney = async () => {
  const session = await workSessionService.startSession(today, now)
  set({ session })
}

// Cache automático e invalidação inteligente
// Validação automática nos repositories
// Tratamento de erros centralizado
```

## 10. **Próximos Passos Futuros**

### 10.1 Monitoramento de Performance
```typescript
// TODO: Implementar métricas de cache
interface CacheMetrics {
  hitRate: number
  missRate: number
  averageResponseTime: number
}
```

### 10.2 Cache Distribuído
```typescript
// TODO: Implementar cache Redis para múltiplas instâncias
export abstract class DistributedCachedRepository extends CachedRepository {
  protected async getDistributedCache<T>(key: string, fetcher: () => Promise<T>): Promise<T>
}
```

### 10.3 Validação Avançada
```typescript
// TODO: Implementar validação com Zod ou Joi
export interface AdvancedValidationRule<T> {
  schema: z.ZodSchema<T>
  customValidators?: Array<(data: T) => ValidationResult>
}
```

## Conclusão

As melhorias implementadas estabelecem uma arquitetura robusta, escalável e manutenível que segue os princípios SOLID. A separação entre repositories, business services, application services e stores, combinada com cache inteligente, validação de dados e tratamento centralizado de erros, resulta em um código mais testável, performático e fácil de manter. 