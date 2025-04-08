import turtle

# Create a turtle object
ps = turtle.Turtle()

# Set up the turtle
ps.shape('turtle')
ps.speed(0)
ps.pensize(3)

# Initial parameters
radius = 30
y = 250

# Move to the starting position
ps.penup()
ps.goto(-300, y)
ps.pendown()

# Draw circles
for i in range(100):
    ps.pendown()
    ps.circle(radius)
    ps.penup()
    ps.forward(radius * 2)
    
    # Move to the next row after every 10 circles
    if i % 10 == 9:
        y -= radius * 2
        ps.goto(-300, y)
        ps.pendown()

# Wait for the user to click before closing
turtle.exitonclick()
