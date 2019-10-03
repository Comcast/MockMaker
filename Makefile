ENVVAR:=GOOS=linux GOARCH=amd64 CGO_ENABLED=0
TAG:=0.12.0
NAME:=mock-maker
DOCKER_IMAGE:=${NAME}:${TAG}

CHART := $(shell find . -name '*.tgz')

all: clean build

publish:
	mkdocs build

build: publish
	docker build -t ${DOCKER_IMAGE} .

run: build
	docker run -p 8080:80 ${DOCKER_IMAGE}

build.docs:
	mkdocs build

serve.docs:
	mkdocs serve

clean:
	if [ -d "site" ]; then rm -rf site/*; rmdir site; fi

guard-%:
	@ if [ "${${*}}" = "" ]; then \
		echo "Environment variable [$*] not set"; \
		exit 1; \
	fi
