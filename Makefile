name = reproducible-bioinformatics/lemaitre
build-arg := $(shell git rev-parse --short HEAD)

build:
	docker build \
		--build-arg GIT_REVISION=$(build-arg) \
		-t $(name):$(build-arg) \
		-t $(name):latest \
		.
