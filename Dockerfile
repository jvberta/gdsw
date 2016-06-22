# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang

# Copy the local package files to the container's workspace.
ADD . /go/src/github.com/gdsw/api

# Build the outyet command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
RUN go get github.com/julienschmidt/httprouter

RUN go install github.com/gdsw/api

# Run the outyet command by default when the container starts.
ENTRYPOINT /go/bin/api

# Document that the service listens on port 8080.
EXPOSE 8080
