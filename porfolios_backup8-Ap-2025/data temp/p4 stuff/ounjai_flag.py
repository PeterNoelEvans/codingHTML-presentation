import turtle

#setupthescreen
screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')

#register the gif imageas a new shape adds screen.
screen.addshape('1855-1893.gif') # ensure this is the correct path to your elephant image 

part = 100
ounjai=turtle.Turtle()
ounjai.speed(2)
#create turtle object for drawing the flag

#draw the flag the
ounjai.begin_fill()
ounjai.fillcolor('#A51931')
ounjai.penup()
ounjai.goto(-400, -300)
ounjai.pendown()

ounjai.forward(part*9)
ounjai.left(90)
ounjai.forward(part*6)
ounjai.left(90)
ounjai.forward(part*9)
ounjai.left(90)
ounjai.forward(part*6)
ounjai.left(90)

#create another turtle object for the elephant image
elephant=turtle.turtle()
elephant.shape('1855-1893.gif')
elephant.penup()










turtle.exitonclick()





