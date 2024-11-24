start-l:
	docker-compose -f docker-compose-local.yml up --build

dstart-l:
	docker-compose -f docker-compose-local.yml up --build -d

stop-l:
	docker-compose -f docker-compose-local.yml down

vstop-l:
	docker-compose -f docker-compose-local.yml down -v

