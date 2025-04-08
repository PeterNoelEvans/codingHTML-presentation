import numpy as np
from PIL import Image, ImageOps
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, writers
import logging

# Set up logging for detailed output
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Ensure the path points to the resized image
image_path = 'peter.png'  # Replace with your resized image path
img = Image.open(image_path).convert("RGBA")
img = ImageOps.contain(img, (1000, 1000))  # Resize to fit within 1000x1000 pixels while preserving aspect ratio

# Function to rotate the image around a specified point
def rotate_image(image, angle, center):
    logging.debug(f"Rotating image by {angle} degrees around center {center}")
    width, height = image.size

    # Create a new image with a transparent background
    rotated_image = Image.new("RGBA", (width, height), (255, 255, 255, 0))

    # Rotate the original image around the specified center
    rotated = image.rotate(angle, resample=Image.BICUBIC, center=center)

    # Paste the rotated image onto the transparent background
    rotated_image.paste(rotated, (0, 0), rotated)

    return rotated_image

# Animation function
def animate(frame):
    angle = (frame * 3) % 360  # Rotate the image by 3 degrees each frame
    center = (img.width // 2, img.height // 1.2)  # Bottom center point of the image
    rotated_img = rotate_image(img, angle, center)
    ax.clear()
    ax.imshow(rotated_img)
    ax.axis('off')

# Set up the figure and axis
fig, ax = plt.subplots()
ax.axis('off')

# Create the animation
ani = FuncAnimation(fig, animate, frames=120, interval=50)  # 120 frames for a full 360-degree rotation

# Explicitly set the ImageMagick writer
Writer = writers['imagemagick']
writer = Writer(fps=20, metadata=dict(artist='Me'), bitrate=1800)

# Verbose output
logging.info("Saving animation...")
ani.save('spinning_image.gif', writer=writer)
logging.info("Animation saved as spinning_image.gif")

plt.show()
