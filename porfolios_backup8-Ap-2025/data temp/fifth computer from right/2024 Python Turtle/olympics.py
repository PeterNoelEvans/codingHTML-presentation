import turtle

def draw_ring(color, x, y):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    turtle.color(color)
    turtle.circle(60)

def draw_bottom_ring(color, x, y):
    turtle.penup()
    turtle.goto(x, y)
    turtle.pendown()
    turtle.color(color)
    turtle.circle(60, 170)
    turtle.penup()
    turtle.circle(60, 20)
    turtle.pendown()
    turtle.circle(60, 170)
# Set up the turtle
turtle.speed(5)
turtle.pensize(10)

# Draw the first row of rings
draw_ring("blue", -120, 0)
draw_ring("black", 0, 0)
draw_ring("red", 120, 0)

# Draw the second row of rings
draw_bottom_ring("yellow", -60, -60)
draw_bottom_ring("green", 60, -60)

# Hide the turtle and display the window
turtle.hideturtle()
turtle.exitonclick()
