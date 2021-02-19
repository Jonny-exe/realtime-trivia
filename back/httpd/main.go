package main

import (
	"log"
	"net/http"
	"os"

	"github.com/httpd/handlers"
	"github.com/rs/cors"
)

func handleRequest() error {
	mux := http.NewServeMux()
	mux.HandleFunc("/", handlers.Test)

	PORT := os.Getenv("YOUR_PORT")
	log.Println(PORT)

	if PORT == "" {
		PORT = "8080"
	}
	// corsHandler := c.Handler(myRouter)
	handler := cors.Default().Handler(mux)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: false,
		AllowedHeaders:   []string{"*"},
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})
	handler = c.Handler(handler)

	log.Println("Listening on port: ", PORT)
	log.Fatal(http.ListenAndServe(":"+PORT, handler))

	return nil
}

func main() {
	err := handleRequest()
	if err != nil {
		log.Fatal(err)
	}
}
