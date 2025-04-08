from PIL import Image, ImageDraw

width, height = 100, 100
img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
draw = ImageDraw.Draw(img)
draw.rectangle([10, 10, 90, 90], outline="black", fill="blue")

img.save('test_image.png')
