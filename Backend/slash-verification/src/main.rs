use actix_cors::Cors;
use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use risk::{get_all_validators, get_total_delegators};
use serde::{Deserialize, Serialize};
use dotenv::dotenv;
use std::env;

mod types;
mod utils;
mod claim;
mod info;
mod risk;

use claim::{claim_generic_cover, claim_slashing_cover};
use types::{SerializableValidator, UserGenericParam, UserSlashingParam};

#[derive(Debug, Deserialize, Serialize)]
enum ApiError {
    InternalError,
    BadRequest(String),
}

async fn claim_slashing_cover_handler(user_param: web::Json<UserSlashingParam>) -> impl Responder {
    match claim_slashing_cover(user_param.into_inner()).await {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(e) => {
            eprintln!("Error in claim_slashing_cover: {:?}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Internal server error"}))
        }
    }
}

async fn claim_generic_cover_handler(user_param: web::Json<UserGenericParam>) -> impl Responder {
    match claim_generic_cover(user_param.into_inner()).await {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(e) => {
            eprintln!("Error in claim_generic_cover: {:?}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Internal server error"}))
        }
    }
}

async fn total_delegator_count() -> impl Responder {
    match get_total_delegators().await {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(e) => {
            eprintln!("Error in claim_generic_cover: {:?}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Internal server error"}))
        }
    }
}

async fn get_all_validators_handler() -> impl Responder {
    match get_all_validators().await {
        Ok(validators) => {
            eprintln!("Number of validators: {}", validators.len());
            let serializable_validators: Vec<SerializableValidator> = validators
                .into_iter()
                .map(SerializableValidator::from)
                .collect();
            HttpResponse::Ok().json(serializable_validators)
        }
        Err(e) => {
            eprintln!("Error in get_all_validators_handler: {:?}", e);
            HttpResponse::InternalServerError().json(serde_json::json!({"error": "Internal server error"}))
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("127.0.0.1:{}", port);

    log::info!("starting HTTP server at http://{}", addr);

    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![actix_web::http::header::AUTHORIZATION, actix_web::http::header::ACCEPT])
                    .allowed_header(actix_web::http::header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(3600)
            )
            .wrap(actix_web::middleware::Logger::default())
            .service(web::resource("/claim-slashing").route(web::post().to(claim_slashing_cover_handler)))
            .service(web::resource("/claim-generic").route(web::post().to(claim_generic_cover_handler)))
            .service(web::resource("/all-validators").route(web::post().to(get_all_validators_handler)))
            .service(web::resource("/delegators").route(web::post().to(total_delegator_count)))
    })
    .bind(addr)?
    .workers(2)
    .run()
    .await
}