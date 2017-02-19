Rails.application.routes.draw do
  get 'sessions/new'

  get 'users/new'

  get 'help' => 'static_pages#help'
  get 'about' => 'static_pages#about'
  get 'contact' => 'static_pages#contact'
  get 'signup' => 'users#new'
  get 'login' => 'sessions#new'
  get 'index' => 'users'
  get 'cities/:id' => 'static_pages#entercities'
  get 'yourtrip' => 'static_pages#yourtrip'
  match 'yourtrip' => 'static_pages#youtrip', :via => :post
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'


  root 'static_pages#home'
  resources :users
  resources :account_activations, only: [:edit]

end
