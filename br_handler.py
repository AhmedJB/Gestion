from barcode import EAN13
from barcode.writer import ImageWriter
from io import BytesIO
import labels
import os.path
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFont, stringWidth
from reportlab.graphics import shapes
from reportlab.lib import colors
import random
random.seed(187459)



# Create an A4 portrait (210mm x 297mm) sheets with 2 columns and 8 rows of
# labels. Each label is 90mm x 25mm with a 2mm rounded corner. The margins are
# automatically calculated.
specs = labels.Specification(50, 25, 1, 1, 50, 25, corner_radius=2)

# Get the path to the demos directory.
base_path = os.path.dirname(__file__)

# Add some fonts.
registerFont(TTFont('Judson Bold', os.path.join(base_path, 'Judson-Bold.ttf')))
registerFont(TTFont('KatamotzIkasi', os.path.join(base_path, 'KatamotzIkasi.ttf')))



def write_name(label, width, height, name):
    # Write the title.
    #label.add(shapes.String(5, height-20, "Hello, my name is",fontName="Judson Bold", fontSize=20))

    # Measure the width of the name and shrink the font size until it fits.
    font_size = 10
    text_width = width - 10
    name_width = stringWidth(name, "Judson Bold", font_size)
    while name_width > text_width:
        font_size *= 0.8
        name_width = stringWidth(name, "Judson Bold", font_size)

    # Write out the name in the centre of the label with a random colour.
    s = shapes.String(width /2, height - 13, name, textAnchor="middle")
    s.fontName = "Judson Bold"
    s.fontSize = font_size
    #s.fillColor = random.choice((colors.black, colors.blue, colors.red, colors.green))
    label.add(s)
    label.add(shapes.Image((width /2) - 70 ,5,140,50,'br.jpg'))








class Generator:

    def __init__(self):
        pass



    def generateBarcode(self,idd):
        with open('br.jpg', 'wb') as f:
            EAN13(idd, writer=ImageWriter()).write(f,options = {"font_size":20})


    def genPdf(self,ids):
        sheet = labels.Sheet(specs, write_name, border=False)
        for idd in ids:
            print(idd)
            self.generateBarcode(idd[1])
            sheet.add_label(idd[0])
        sheet.save('media/br.pdf')




if __name__ == "__main__":
    g = Generator()
    l = [['radiateur dacia eau v25 mn 3nd si hamid','9655862692768'], ['radiateur dacia eau v25 mn 3nd si hamid','9655862692768']]
    g.genPdf(l)
    print('generated')