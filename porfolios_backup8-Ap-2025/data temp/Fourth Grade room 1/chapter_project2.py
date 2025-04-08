# I helped considerably with this one but now Chapter is getting the hang of things,
# he is progressing - still needs help but I see progress.

import turtle
chapter=turtle.Turtle()
chapter.speed(0.1)

screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')
chapter.penup()
chapter.goto(-550,-350)
chapter.pendown()



length=130

chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*6)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*6)
chapter.left(90)
chapter.speed(0.1)

chapter.color('red') # red
chapter.begin_fill()
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.end_fill()


chapter.backward(length)
chapter.left(90)

chapter.color('white') # red
chapter.begin_fill()
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.end_fill()

chapter.backward(length)
chapter.left(90)

chapter.color('blue') # red
chapter.begin_fill()
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*2)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*2)
chapter.end_fill()

chapter.backward(length*2)
chapter.left(90)

chapter.color('white')
chapter.begin_fill()
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.end_fill()


chapter.backward(length*1)
chapter.left(90)

chapter.color('red')
chapter.begin_fill()
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*1)
chapter.end_fill()




turtle.exitonclick()
