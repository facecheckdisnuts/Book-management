const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');





const BookType = new GraphQLObjectType({
    name:'Book',
    fields:() =>({
        id:{type:GraphQLID},
        title:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                return Author.findById(parent.authorID);
            }
        }
    })

});

const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
               // return _.filter(books,{authorID:parent.id});
               return Book.find({authorID:parent.id});

            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
              //code to get datat from DB
                 // return _.find(books,{id:args.id});
              return Book.findById(args.id);   
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                //return _.find(authors,{id:args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                //return books;
                return Book.find({});
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                //return authors;
                return Author.find({});
            }
        }

    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name: {type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(prent,args){
                let author = new Author({
                    name:args.name
                });
                return author.save();
            }

        },
        addBook:{
            type:BookType,
            args:{
                title:{type:new GraphQLNonNull(GraphQLString)},
                authorID:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    title:args.title,
                    authorID:args.authorID
                });
                return book.save();
            }
        }

    }
})

module.exports= new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
});