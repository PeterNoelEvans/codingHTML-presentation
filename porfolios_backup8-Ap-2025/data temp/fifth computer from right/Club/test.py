import turtle

# Function to draw a star-like shape with given size and color
def draw_star(turtle_obj, size, color):
    turtle_obj.color(color)
    for _ in range(12):  # 12 lines to create the star effect
        turtle_obj.forward(size)
        turtle_obj.left(150)

# Initialize turtle
ps = turtle.Turtle()
ps.speed(15)
ps.shapesize(1)

# Draw three stars of different sizes and colors
ps.penup()
ps.goto(-150, 0)
ps.pendown()
draw_star(ps, 300, 'purple')  # First star

ps.penup()
ps.goto(-200, 0)
ps.pendown()
draw_star(ps, 400, 'red')  # Second star

ps.penup()
ps.goto(-250, 0)
ps.pendown()
draw_star(ps, 500, 'pink')  # Third star

# Exit on click
turtle.exitonclick()
