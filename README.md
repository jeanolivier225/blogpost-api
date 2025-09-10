## DOCKERIZED BLOGPOST API


## Initialisation

Make sure to have [composer](https://getcomposer.org/download/) and [docker](https://www.docker.com/products/docker-desktop/) installed


1- Copy <code>.env.example</code> file to <code>.env</code>.

2- The run <code>php artisan key:generate</code>.

3- Set the api keys for feed providers in __.env__ file:
> New york times: <code>NYTIMES_API_KEY</code>
>
> The guardian: <code>THEGUARDIAN_API_KEY</code>
>
> NewsApi: <code>NEWSAPI_KEY</code>

4- Run <code>composer install</code> inside the project folder.

5- Run <code>docker-compose up --build</code> to build and the api services

_The databse will be create during image build process_

5- Run <code>docker-compose exec php sh</code> to switch the php terminal
and run <code>php artisan migrate --seed</code> the first time.

6- Still in docker php terminal, run <code>php artisan fetch:feed</code> to fetch feed news from **_New york Times, The Guardian and NewsApi_** plateform.

_The database volume is mapped on the db-data inside the project folder, so you don't loose your data on restarts_

API Server is running on port [localhost:8080](localhost:8080)

