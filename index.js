class Category {
    constructor(name) {
        this.name = name;
        this.movies = [];
    }

    addMovie(title, releaseDate) {
        this.movies.push(new Movie(title, releaseDate));
    }
}

class Movie {
    constructor(title, releaseDate){
        this.title = title;
        this.releaseDate = releaseDate;
    }
}

class CategoryService {
    static url = "https://6539d7c7e3b530c8d9e8be33.mockapi.io/movies";

    static getAllCategories() {
        return $.get(this.url);
    }

    static getCategory(_id) {
        return $.get(this.url + `/$(id)`);
    }

    static createCategory(category) {
        return $.post(this.url, category);
    }

    static updateCategory(category) {
        return $.ajax({
            url: this.url + `/${category._id}`,
            dataType: 'json',
            data: JSON.stringify(category),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCategory(_id) {
        return $.ajax({
            url: this.url + `/$(id)`,
            type: "DELETE"
        });
    }
}

class DOMManager {
    static categories;

    static getAllCategories() {
    
        CategoryService.getAllCategories().then(categories => this.render(categories));
    }
static createCategory(name) {
    CategoryService.createCategory(new Category(name))
    .then(() => {
        return CategoryService.getAllCategories();
    })
    .then((categories) => this.render(categories));
} 

static deleteCategory(id) {
        CategoryService.deleteCategory(id)
        .then(() => {
            return CategoryService.getAllCategories();
        })
        .then((categories) => this.render(categories));
    }

    static addMovie(id) {
        for( let category of this.categories) {
            if (category._id == id) {
                category.movies.push(new Movie($("#${category._id}-movie-title").val(), $("#${category._id}-movie-releaseDate").val()));
                CategoryService.updateCategory(category) 
                .then(() => {
                    return CategoryService.getAllCategories();
                })
                .then((categories) => this.render(categories));  
                }
            }
        } 

    static deleteMovie(categoryId, movieId) {
        for(let category of this.categories) {
            if(category._id == categoryId) {
               for(let movie of category.movies) {
                if(movie._id == movieId) {
                    category.movies.splice(category.movies.indexOf(Movie), l);
                    CategoryService.updateCategory(category)
                    .then(() => {
                        return CategoryService.getAllCategories();
                    })
                    .then((categories) => this.render(categories));
                }
               } 
            }
        }

    }

    static render(categories) {
        this.categories = categories;
        $('#app').empty();
        for (let category of categories) {
            $('#app').prepend(
            `<div id="${category._id}" class="card">
            <div class="card-header">
            <h2>${category.name}</h2>
            <button class="btn btn-danger" onclick="DOMManager.deleteCategory('${category._id}')">Delete</button>
            </div>
            <div class="card-body">
            <div class="card">
            <div class="row">
            <div class="col-sm">
            <input type="text" id="${category._id}-movie-title" class="form-control" placeholder="Movie Name">
            </div>
            <div class="col-sm">
            <input type="text" id="${category._id}-movie-releaseDate" class="form-control" placeholder="Movie Release Date">
            </div>
            </div>
            <button id="${category._id}-new-movie" onclick="DOMManager.addMovie('${category.id}')" class="btn btn-primary form-control">Add</button>
            </div>
            </div>
            </div>
            </div>
            <br>
            `
        );
           
        for(Movie of Category.movies) {
                $("#${category._id}").find('.card-body').append(
                    `<p>
                    <span id="title-${Movie._id}"><strong>Title: </stron> ${Movie.title}</span>
                    <span id="releaseDate-${Movie._id}"><strong>Realease Date: </strong> ${Movie.releaseDate}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteMovie('${Category._id}', '${Movie._id}')">Delete Movie</button>
                    `
                    
                );
            }
        }
    }
}


$('#create-new-category').click(() => {
DOMManager.createCategory($('#new-category-name').val());
$('#new-category-name').val('');
});

DOMManager.getAllCategories();

