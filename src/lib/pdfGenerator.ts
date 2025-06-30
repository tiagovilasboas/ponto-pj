import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface PDFData {
  month: string
  stats: {
    totalHours: number
    completeDays: number
    incompleteDays: number
  }
  sessions: Array<{
    date: string
    entry: string
    exit: string
    netTime: string
    status: string
  }>
}

export const generatePDF = (data: PDFData): void => {
  const doc = new jsPDF()
  
  // Configurações de fonte
  doc.setFont('helvetica')
  
  // Título
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Relatório de Ponto', 105, 20, { align: 'center' })
  
  // Mês
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(`Período: ${data.month}`, 105, 35, { align: 'center' })
  
  // Estatísticas
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Estatísticas do Período:', 20, 55)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total de horas: ${formatHours(data.stats.totalHours)}`, 20, 70)
  doc.text(`Dias completos: ${data.stats.completeDays}`, 20, 80)
  doc.text(`Dias incompletos: ${data.stats.incompleteDays}`, 20, 90)
  
  // Tabela de registros
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Registros Detalhados:', 20, 110)
  
  // Preparar dados da tabela
  const tableData = data.sessions.map(session => [
    session.date,
    session.entry,
    session.exit,
    session.netTime,
    session.status
  ])
  
  // Gerar tabela
  autoTable(doc, {
    head: [['Data', 'Entrada', 'Saída', 'Tempo Líquido', 'Status']],
    body: tableData,
    startY: 120,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Azul
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Cinza claro
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Data
      1: { cellWidth: 25 }, // Entrada
      2: { cellWidth: 25 }, // Saída
      3: { cellWidth: 30 }, // Tempo Líquido
      4: { cellWidth: 25 }, // Status
    },
  })
  
  // Rodapé
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Página ${i} de ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
  
  // Salvar PDF
  const fileName = `time-report-${data.month.toLowerCase().replace(' ', '-')}.pdf`
  doc.save(fileName)
}

// Função auxiliar para formatar horas
const formatHours = (hours: number): string => {
  const hoursInt = Math.floor(hours)
  const minutes = Math.round((hours - hoursInt) * 60)
  return `${hoursInt}h ${minutes}min`
} 