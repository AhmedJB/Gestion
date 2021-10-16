from barcode import EAN13
from barcode.writer import ImageWriter
from io import BytesIO,StringIO
import PIL
import labels
import os.path
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFont, stringWidth
from reportlab.graphics import shapes
from reportlab.lib import colors
from reportlab.graphics import barcode
import os

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
registerFont(TTFont('Roboto', os.path.join(base_path, 'Roboto-Black.ttf')))




def write_name(label, width, height, name):
    # Write the title.
    #label.add(shapes.String(5, height-20, "Hello, my name is",fontName="Judson Bold", fontSize=20))

    # Measure the width of the name and shrink the font size until it fits.
    br_text = name[1]
    name = name[0]
    font_size = 10
    text_width = width - 10
    name_width = stringWidth(name, "Roboto", font_size)
    while name_width > text_width:
        font_size -= 0.2
        name_width = stringWidth(name, "Roboto", font_size)

    # Write out the name in the centre of the label with a random colour.
    s = shapes.String(width /2, height - 13, name, textAnchor="middle")
    s.fontName = "Roboto"
    s.fontSize = font_size
    #s.fillColor = random.choice((colors.black, colors.blue, colors.red, colors.green))
    label.add(s)
    #print(br_text)
    barcode_image_raw = barcode.createBarcodeImageInMemory('Code128', value=br_text, width=1000, height=1000)
    barcode_image = PIL.Image.open(BytesIO(barcode_image_raw))
    barcode_image.save("{0}.png".format(br_text), 'png')

    font_size = 10
    text_width = width - 10
    name_width = stringWidth(br_text, "Roboto", font_size)
    while name_width > text_width:
        font_size -= 0.2
        name_width = stringWidth(br_text, "Roboto", font_size)
    s = shapes.String(width /2, 5, br_text, textAnchor="middle")
    s.fontName = "Roboto"
    s.fontSize = font_size
    label.add(s)

    # later on (after declaring barcode_x, barcode_y, barcode_width and barcode_height)
    label.add(shapes.Image((width /2) - 70, 15, 140, 40, "{0}.png".format(br_text)))
    
    #label.add(shapes.Image((width /2) - 70 ,0,,,'br.jpg'))








class Generator:

    def __init__(self):
        pass



    def generateBarcode(self,idd):
        with open('br.jpg', 'wb') as f:
            #print('idd : '+str(idd))
            EAN13(idd, writer=ImageWriter()).write(f,options = {"font_size":30,"module_width":0.5,"text_distance":2})


    def genPdf(self,ids):
        sheet = labels.Sheet(specs, write_name, border=False)
        for idd in ids:
            #print(idd)
            #self.generateBarcode(idd[1])
            for _ in range(int(idd[-1])):
                sheet.add_label([idd[0],idd[1]])
        sheet.save('media/br.pdf')
        for idd in ids:
            if (idd[-1]  != 0):
                os.remove('{0}.png'.format(str(idd[1])))




if __name__ == "__main__":
    g = Generator()
    l = []
    g.genPdf(l)
    #print('generated')