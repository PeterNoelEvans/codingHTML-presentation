import turtle

# Set up the screen
screen = turtle.Screen()
screen.setup(2000,1800,0, 5)
screen.bgcolor('skyblue')

# Register the GIF image as a new shape
screen.addshape("1855-1893.gif")  # Ensure this is the correct path to your elephant image

# Create turtle object for drawing the flag

uda = turtle.Turtle()
uda.speed(2)
part = 130
 
# Draw the flag
uda.begin_fill()
uda.fillcolor('#A51931')
uda.penup()
uda.goto(-400, -300)
uda.pendown()

uda.forward(part*9)
uda.left(90)
uda.forward(part*6)
uda.left(90)
uda.forward(part*9)            
uda.left(90)
uda.forward(part*6)
uda.end_fill()


# Create another turtle object for the elephant image
elephant = turtle.Turtle()
elephant.shape("1855-1893.gif")
elephant.penup()

# Position the elephant in the middle of the flag
# Adjust these coordinates to place it precisely where you want
uda.penup()
elephant.goto(200, 100)
uda.backward(part*6)
uda.pendown()
uda.pensize(9)
uda.forward((part*6 + 150))
# Exit on click
turtle.exitonclick()
