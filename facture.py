from borb.pdf.document import Document
from borb.pdf.page.page import Page
from borb.pdf.canvas.layout.page_layout.multi_column_layout import SingleColumnLayout
from decimal import Decimal
from borb.pdf.canvas.layout.image.image import Image
from borb.pdf.canvas.layout.table.fixed_column_width_table import FixedColumnWidthTable as Table
from borb.pdf.canvas.layout.text.paragraph import Paragraph
from borb.pdf.canvas.layout.layout_element import Alignment
from borb.pdf.canvas.layout.table.fixed_column_width_table import FixedColumnWidthTable as Table
from borb.pdf.canvas.layout.table.table import TableCell
from datetime import datetime
import random
from borb.pdf.canvas.color.color import HexColor, X11Color
from borb.pdf.pdf import PDF


def _build_itemized_description_table():  
    table_001 = Table(number_of_rows=15, number_of_columns=4)  
    for h in ["DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT"]:  
        table_001.add(  
            TableCell(  
                Paragraph(h, font_color=X11Color("White")),  
                background_color=HexColor("016934"),  
            )  
        )  
  
    odd_color = HexColor("BBBBBB")  
    even_color = HexColor("FFFFFF")  
    for row_number, item in enumerate([("Product 1", 2, 50), ("Product 2", 4, 60), ("Labor", 14, 60)]):  
        c = even_color if row_number % 2 == 0 else odd_color  
        table_001.add(TableCell(Paragraph(item[0]), background_color=c))  
        table_001.add(TableCell(Paragraph(str(item[1])), background_color=c))  
        table_001.add(TableCell(Paragraph("$ " + str(item[2])), background_color=c))  
        table_001.add(TableCell(Paragraph("$ " + str(item[1] * item[2])), background_color=c))  
	  
	# Optionally add some empty rows to have a fixed number of rows for styling purposes
    for row_number in range(3, 10):  
        c = even_color if row_number % 2 == 0 else odd_color  
        for _ in range(0, 4):  
            table_001.add(TableCell(Paragraph(" "), background_color=c))  
  
    table_001.add(TableCell(Paragraph("Subtotal", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT,), col_span=3,))  
    table_001.add(TableCell(Paragraph("$ 1,180.00", horizontal_alignment=Alignment.RIGHT)))  
    table_001.add(TableCell(Paragraph("Discounts", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT,),col_span=3,))  
    table_001.add(TableCell(Paragraph("$ 177.00", horizontal_alignment=Alignment.RIGHT)))  
    table_001.add(TableCell(Paragraph("Taxes", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT), col_span=3,))  
    table_001.add(TableCell(Paragraph("$ 100.30", horizontal_alignment=Alignment.RIGHT)))  
    table_001.add(TableCell(Paragraph("Total", font="Helvetica-Bold", horizontal_alignment=Alignment.RIGHT  ), col_span=3,))  
    table_001.add(TableCell(Paragraph("$ 1163.30", horizontal_alignment=Alignment.RIGHT)))  
    table_001.set_padding_on_all_cells(Decimal(2), Decimal(2), Decimal(2), Decimal(2))  
    """ table_001.no_borders()  """ 
    return table_001

pdf = Document()

# Add page
page = Page()
pdf.append_page(page)

page_layout = SingleColumnLayout(page)
page_layout.vertical_margin = page.get_page_info().get_height() * Decimal(0.02)


page_layout.add(_build_itemized_description_table())

with open("output2.pdf", "wb") as pdf_file_handle:
    PDF.dumps(pdf_file_handle, pdf)