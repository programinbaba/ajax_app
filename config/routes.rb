Rails.application.routes.draw do
  root to: "posts#index"
  post "posts", to: "posts#create"
  get "post/:id", to: "posts#checked"
end