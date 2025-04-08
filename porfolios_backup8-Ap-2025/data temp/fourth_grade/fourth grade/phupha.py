import turtle
import time
window =turtle.Screen()
window.setup(2000,1800,0,0)
window.bgcolor('SKYBLUE')


pen=turtle.Turtle()
pen.speed(0)
pen.shapesize(1)
pen.shape('turtle')
pen.goto(x=-400,y=-200)

step =100


pen.fillcolor('#A51931')
pen.begin_fill()
pen.forward(step*9)
pen.left(90)
pen.forward(step*6)
pen.left(90)
pen.forward(step*9)
pen.left(90)
pen.forward(step*6)
pen.end_fill()

pen.backward(step*6)
pen.pencolor('black')
pen.pensize(15)
pen.forward(step*6+100)


time.sleep(5)
#pen.clear()
window.clear()
pen = turtle.Turtle()
screen = turtle.Screen()
pen.speed(0)
pen.shapesize(2)
pen.shape('turtle')
pen.penup()
pen.goto(x=-400,y=-200)
pen.pd()


pen.fillcolor('#A51931') # red flag
pen.begin_fill()
pen.forward(step*9)
pen.left(90)
pen.forward(step*6)
pen.left(90)
pen.forward(step*9)
pen.left(90)
pen.forward(step*6)
pen.end_fill()

pen.backward(step*6)
pen.pencolor('black')
pen.pensize(15)
pen.forward(step*6+100)

# Create a turtle
flag_turtle = turtle.Turtle()
# Move the turtle to a position if necessary
flag_turtle.penup()  # Lift the pen to avoid drawing lines
flag_turtle.goto(50, 100)  # Move the turtle to the center of the screen
# Load the image
image_file = "1790-1820.gif"  # 
screen.addshape(image_file)
flag_turtle.shape(image_file)




turtle.exitonclick()