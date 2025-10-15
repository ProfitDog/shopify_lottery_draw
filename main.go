package main

import (
	"shopify_lottery_draw/app/web"
)

func main() {
	router := web.SetupRouter()
	router.Run(":8080")
}
