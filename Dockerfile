# Host build check: `npm run build` succeeded; `cargo build --release` is not applicable because this repository is a Node/Vite app.
# Production image: build static assets in a Node stage, then serve the compiled `dist/` output from nginx at port 8080.
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
