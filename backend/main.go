package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Todo struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

var todos = []Todo{
	{ID: "1", Title: "Learn Go", Done: false},
	{ID: "2", Title: "Build an API", Done: false},
}

func main() {
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Get all todos
	r.GET("/todos", func(c *gin.Context) {
		c.JSON(http.StatusOK, todos)
	})

	// Add a new todo
	r.POST("/todos", func(c *gin.Context) {
		var newTodo Todo
		if err := c.ShouldBindJSON(&newTodo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		todos = append(todos, newTodo)
		c.JSON(http.StatusCreated, newTodo)
	})

	r.DELETE("/todos/:id", func(c *gin.Context) {
		id := c.Param("id")
		for i, todo := range todos {
			if todo.ID == id {
				todos = append(todos[:i], todos[i+1:]...)
				c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
	})

	// Update a todo's done status
	r.PUT("/todos/:id", func(c *gin.Context) {
		id := c.Param("id")
		for i, todo := range todos {
			if todo.ID == id {
				// Toggle the done status
				todos[i].Done = !todos[i].Done
				c.JSON(http.StatusOK, todos[i])
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
	})

	r.Run() // Listen and serve on 0.0.0.0:8080
}
