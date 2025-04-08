import turtle
window=turtle.Screen()
window.setup(2000,1500,0,0)
window.bgcolor('black')
tar=turtle.Turtle()
tar.speed(0.1)
length = 100

tar.fillcolor('skyblue')
tar.begin_fill()
tar.forward(1000)
tar.left(90)
tar.forward(1000)
tar.left(90)
tar.forward(2000)
tar.left(90)
tar.forward(1000)
tar.left(90)
tar.forward(1000)
tar.end_fill()

tar.fillcolor('turquoise')
tar.begin_fill()
tar.forward(1000)
tar.right(90)
tar.forward(1000)
tar.right(90)
tar.forward(2000)
tar.right(90)
tar.forward(1000)
tar.right(90)
tar.forward(1000)
tar.end_fill()




turtle.exitonclick()