use axum::{
    extract::Json,
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

const JWT_SECRET: &[u8] = b"bolo-secure-jwt-secret-key-2026-super-safe-and-fast";

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub username: String,
    pub exp: usize,
    pub iat: usize,
}

#[derive(Deserialize)]
pub struct CreateTokenRequest {
    pub username: String,
    pub user_id: Option<String>,
}

#[derive(Serialize)]
pub struct TokenResponse {
    pub token: String,
    pub expires_in: usize,
}

#[derive(Deserialize)]
pub struct VerifyTokenRequest {
    pub token: String,
}

#[derive(Serialize)]
pub struct VerifyResponse {
    pub valid: bool,
    pub username: Option<String>,
}

#[derive(Deserialize)]
pub struct HashRequest {
    pub password: String,
}

#[derive(Serialize)]
pub struct HashResponse {
    pub hash: String,
}

#[derive(Deserialize)]
pub struct VerifyPasswordRequest {
    pub password: String,
    pub hash: String,
}

#[derive(Serialize)]
pub struct VerifyPasswordResponse {
    pub matches: bool,
}

// Handler: Issue JWT Token in Rust
async fn create_token(Json(payload): Json<CreateTokenRequest>) -> impl IntoResponse {
    let now = Utc::now();
    let expire = now + Duration::days(30);

    let claims = Claims {
        sub: payload.user_id.unwrap_or_else(|| payload.username.clone()),
        username: payload.username,
        iat: now.timestamp() as usize,
        exp: expire.timestamp() as usize,
    };

    match encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(JWT_SECRET),
    ) {
        Ok(token) => (
            StatusCode::OK,
            Json(serde_json::json!(TokenResponse {
                token,
                expires_in: 30 * 24 * 3600,
            })),
        ),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({ "error": "Token generation failed" })),
        ),
    }
}

// Handler: Verify JWT Token in Rust
async fn verify_token(Json(payload): Json<VerifyTokenRequest>) -> impl IntoResponse {
    let validation = Validation::default();
    match decode::<Claims>(
        &payload.token,
        &DecodingKey::from_secret(JWT_SECRET),
        &validation,
    ) {
        Ok(token_data) => (
            StatusCode::OK,
            Json(serde_json::json!(VerifyResponse {
                valid: true,
                username: Some(token_data.claims.username),
            })),
        ),
        Err(_) => (
            StatusCode::UNAUTHORIZED,
            Json(serde_json::json!(VerifyResponse {
                valid: false,
                username: None,
            })),
        ),
    }
}

// Handler: Health check
async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "service": "bolo-rust-auth",
        "version": "0.1.0"
    }))
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/auth/token", post(create_token))
        .route("/auth/verify", post(verify_token))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    println!("🚀 Bolo Rust Auth Microservice running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
