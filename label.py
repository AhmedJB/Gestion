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
specs = labels.Specification(60, 40, 1, 1, 60, 40, corner_radius=2)

# Get the path to the demos directory.
base_path = os.path.dirname(__file__)

# Add some fonts.
registerFont(TTFont('Judson Bold', os.path.join(base_path, 'Judson-Bold.ttf')))
registerFont(TTFont('KatamotzIkasi', os.path.join(base_path, 'KatamotzIkasi.ttf')))

# Create a function to draw each label. This will be given the ReportLab drawing
# object to draw on, the dimensions (NB. these will be in points, the unit
# ReportLab uses) of the label, and the name to put on the tag.
def write_name(label, width, height, name):
    # Write the title.
    #label.add(shapes.String(5, height-20, "Hello, my name is",
                            #fontName="Judson Bold", fontSize=20))

    # Measure the width of the name and shrink the font size until it fits.
    #font_size = 50
    #text_width = width - 10
    #name_width = stringWidth(name, "KatamotzIkasi", font_size)
    #while name_width > text_width:
    #    font_size *= 0.8
    #    name_width = stringWidth(name, "KatamotzIkasi", font_size)

    # Write out the name in the centre of the label with a random colour.
    #s = shapes.String(width/2.0, 15, name, textAnchor="middle")
    #s.fontName = "KatamotzIkasi"
    #s.fontSize = font_size
    #s.fillColor = random.choice((colors.black, colors.blue, colors.red, colors.green))
    #label.add(s)
 label.add(shapes.Image(-15,5,50,50,'code.jpeg'))

# Create the sheet.
sheet = labels.Sheet(specs, write_name, border=True)
#sheet.partial_page(1, ((1, 1), (2, 2), (4, 2)))

# Use an external file as the data source. NB. we need to remove the newline
# character from each line.
with open(os.path.join(base_path, "names.txt")) as names:
    sheet.add_labels(name.strip() for name in names)
    

# Save the file and we are done.
sheet.save('nametags.pdf')
print("{0:d} label(s) output on {1:d} page(s).".format(sheet.label_count, sheet.page_count))