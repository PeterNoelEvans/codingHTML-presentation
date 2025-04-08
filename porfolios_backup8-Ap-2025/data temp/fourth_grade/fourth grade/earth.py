import turtle
window = turtle.Screen()
window.setup(2000,1800,0,0)
window.bgcolor('SKYBLUE')
earth=turtle.Turtle()
earth.goto(-400,-300)
step = 100
earth.speed(0)
earth.forward(step*9)
earth.left(90)
earth.forward(step*6)
earth.left(90)
earth.forward(step*9)
earth.left(90)
earth.forward(step*6)
earth.left(90) #
earth.begin_fill()

earth.fillcolor('')
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.end_fill()

earth.right(90)
earth.backward(step)
earth.left(90)


earth.fillcolor('#F4F5F8') # white
 
earth.begin_fill()
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.end_fill()

earth.right(90)
earth.backward(step)
earth.left(90)


earth.fillcolor('#2D2A4A') #blue
earth.begin_fill()
earth.forward(step*9)
earth.left(90)
earth.forward(step*2)
earth.left(90)
earth.forward(step*9)
earth.left(90)
earth.forward(step*2)
earth.left(90)
earth.end_fill()


earth.right(90)
earth.backward(step*2)
earth.left(90)

earth.fillcolor('#F4F5F8') #white
earth.begin_fill()
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.end_fill()

earth.right(90)
earth.backward(step*1)
earth.left(90)

earth.fillcolor('#A51931') #red
earth.begin_fill()
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.forward(step*9)
earth.left(90)
earth.forward(step*1)
earth.left(90)
earth.end_fill()
earth.left(90)

earth.right(180)
earth.backward(step*1)
earth.pencolor('black')
earth.pensize(15)
earth.forward(step*7)

turtle.exitonclick()