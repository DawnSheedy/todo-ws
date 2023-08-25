APPNAME = todo-ws
TAG ?= $(shell bash -c 'read -p "Select Tag: " tag; echo $$tag')
NAMESPACE ?= $(shell bash -c 'read -p "Select Namespace: " namespace; echo $$namespace')

build-image:
	docker build -t ${APPNAME}:${TAG} .

push-image:
	docker tag ${APPNAME}:${TAG} registry.digitalocean.com/ds-services-container/${APPNAME}:${TAG}
	docker push registry.digitalocean.com/ds-services-container/${APPNAME}:${TAG}

dev-force: dev-destroy
dev-force: dev

dev: NAMESPACE = dev
dev: TAG = development
dev: build-image
dev: helm-deploy

dev-destroy: NAMESPACE = dev
dev-destroy: helm-destroy

helm-deploy:
	helm upgrade --install --create-namespace -n ${NAMESPACE} --set image.tag=${TAG} --set namespace=${NAMESPACE} ${APPNAME} ${APPNAME}

helm-destroy:
	helm uninstall -n ${NAMESPACE} ${APPNAME}

test: test-teardown-and-rebuild
test: test-raw

test-teardown-and-rebuild:
	docker compose -f docker-compose.test.yaml down
	docker compose -f docker-compose.test.yaml build

test-raw: GH_SECRET = ''
test-raw:
	docker-compose -f docker-compose.test.yaml up \
    --abort-on-container-exit \
    --exit-code-from unit-test