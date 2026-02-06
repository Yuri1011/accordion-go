package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type AccordionItem struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func main() {
	conn := "host=localhost port=5432 user=postgres password=admin123 dbname=accordion_db sslmode=disable"

	db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/api/accordion", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, title, content FROM accordion_items")
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer rows.Close()

		items := []AccordionItem{}

		for rows.Next() {
			var item AccordionItem
			err := rows.Scan(&item.Id, &item.Title, &item.Content)
			if err != nil {
				http.Error(w, "Ошибка строки: "+err.Error(), http.StatusInternalServerError)
				return
			}
			items = append(items, item)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(items)
	})

	log.Println("Сервер запущен на :8080")
	// Статические файлы (HTML, CSS, JS)
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	http.ListenAndServe(":8080", nil)
}
