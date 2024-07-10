name = reproducible-bioinformatics/lemaitre
build-arg := $(shell git describe --exact-match --tags 2> /dev/null || git rev-parse --short HEAD)

build:
	docker build \
		--build-arg GIT_REVISION=$(build-arg) \
		-t $(name):$(build-arg) \
		.
	echo $(name):$(build-arg)
