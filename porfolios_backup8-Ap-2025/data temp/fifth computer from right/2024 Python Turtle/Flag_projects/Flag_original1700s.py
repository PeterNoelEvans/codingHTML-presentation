import turtle

# Set up the screen
screen = turtle.Screen()
screen.setup(2000,1800,0, 5)
screen.bgcolor('skyblue')

# Register the GIF image as a new shape
screen.addshape("1855-1893.gif")  # Ensure this is the correct path to your elephant image

# Create turtle object for drawing the flag
sp = turtle.Turtle()
sp.speed(2)
part = 130

# Draw the flag
sp.begin_fill()
sp.fillcolor('#A51931')
sp.penup()
sp.goto(-400, -300)
sp.pendown()

sp.forward(part*9)
sp.left(90)
sp.forward(part*6)
sp.left(90)
sp.forward(part*9)
sp.left(90)
sp.forward(part*6)
sp.end_fill()


# Create another turtle object for the elephant image
elephant = turtle.Turtle()
elephant.shape("1855-1893.gif")
elephant.penup()

# Position the elephant in the middle of the flag
# Adjust these coordinates to place it precisely where you want
sp.penup()
elephant.goto(200, 100)
sp.backward(part*6)
sp.pendown()
sp.pensize(9)
sp.forward((part*6 + 150))
# Exit on click
turtle.exitonclick()
