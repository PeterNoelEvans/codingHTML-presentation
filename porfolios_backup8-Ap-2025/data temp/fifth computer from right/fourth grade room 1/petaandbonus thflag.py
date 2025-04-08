import turtle

# Set up the window
window = turtle.Screen()
window.bgcolor('skyblue')
window.setup(2000, 1800, 0, 0)
window.title("Petaandbonus is a CROCKCOACH HEHEH")

# Register the custom shape for the elephant
window.addshape("1855-1893.gif")

# Create the turtle for drawing the flag
peta = turtle.Turtle()
peta.shape('turtle')
peta.shapesize(2)
peta.pensize(3)
step = 100


def draw_flag_stick():
    peta.penup()
    peta.pencolor('darkseagreen')  
    peta.pensize(15)
    peta.right(90)
    peta.backward(step*6)
    peta.pendown()
    peta.forward(step*6+100)


#Function to draw the red square flag
def draw_square_red():
    peta.penup()
    peta.goto(-300, -300)
    peta.pendown()
    peta.color('#A51931')  # red
    peta.begin_fill()
    peta.forward(step * 9)
    peta.left(90)
    peta.forward(step * 6)
    peta.left(90)
    peta.forward(step * 9)
    peta.left(90)
    peta.forward(step * 6)
    peta.left(90)
    peta.end_fill()

# Draw the flag stick and then the red square flag
draw_square_red()
draw_flag_stick()

# Create the elephant turtle after drawing the square
elephant = turtle.Turtle()
elephant.shape("1855-1893.gif")

# Move the elephant towards the center of the flag
elephant.penup()  # Lift the pen to avoid drawing
elephant.goto(-300 + (step * 9) / 2, -300 + (step * 6) / 2)  # Calculate the center of the red square


turtle.exitonclick()
