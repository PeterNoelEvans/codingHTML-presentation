import turtle
import random
import time

# Set up the screen
screen = turtle.Screen()
screen.title("Real-Time Position Tracking")
screen.bgcolor("green")
screen.setup(width=800, height=600)

# Draw the football field
field = turtle.Turtle()
field.hideturtle()
field.speed(0)
field.color("white")
field.penup()
field.goto(-350, -250)
field.pendown()
for _ in range(2):
    field.forward(700)
    field.left(90)
    field.forward(500)
    field.left(90)

# Create player turtles
players = {}
player_colors = ["red", "blue", "yellow", "purple"]

for i in range(1, 5):  # Create 5 players for example
    player = turtle.Turtle()
    player.shape("circle")
    player.color(player_colors[i-1])
    player.penup()
    players[f"Player{i}"] = player

# Function to smoothly move all players to new positions
def move_players(new_positions):
    steps = 20  # Number of steps for smooth movement
    for step in range(steps):
        for player_id, player in players.items():
            current_x = player.xcor()
            current_y = player.ycor()
            new_x, new_y = new_positions[player_id]

            delta_x = (new_x - current_x) / steps
            delta_y = (new_y - current_y) / steps

            player.setx(current_x + delta_x)
            player.sety(current_y + delta_y)

        screen.update()  # Update the screen after moving all players
        time.sleep(0.0005)  # Short delay for smooth animation

# Function to simulate and update player positions
def update_positions():
    new_positions = {}
    for player_id in players:
        # Simulate new positions
        new_x = random.randint(-350, 350)
        new_y = random.randint(-250, 250)
        new_positions[player_id] = (new_x, new_y)

    move_players(new_positions)

# Main loop to update positions
while True:
    update_positions()
    time.sleep(0)  # Update every second

# Keep the window open
screen.mainloop()
