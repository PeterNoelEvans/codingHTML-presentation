import turtle
chapter=turtle.Turtle()
chapter.speed(0.1)

screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')

chapter.penup()
chapter.goto(-500,-350)
chapter.pendown()

length=130
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*6)
chapter.left(90)
chapter.forward(length*9)
chapter.left(90)
chapter.forward(length*6)
chapter.left(180)
chapter.forward(length*1)
chapter.left(270)
chapter.forward(length*9)




turtle.exitonclick()