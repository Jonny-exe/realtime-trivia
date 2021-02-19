package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

// Test ..
func Test(w http.ResponseWriter, r *http.Request) {
	log.Println("Everything works")
	json.NewEncoder(w).Encode("Everything works here")
}
