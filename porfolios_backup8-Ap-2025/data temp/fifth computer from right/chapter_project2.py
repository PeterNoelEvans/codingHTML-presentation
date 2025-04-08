import turtle
chapter=turtle.Turtle()
chapter.speed(0.1)

screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')
chapter.goto(-500,-350)

length=130
chapter.forward(length*9)
chapter.left(90)




turtle.exitonclick()