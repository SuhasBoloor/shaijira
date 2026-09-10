jest.mock('../../src/repository/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const userRepository = require('../../src/repository/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../../src/service/authService');

describe("Auth Service Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("should throw an error if username already exists", async () => {
            userRepository.getUser.mockResolvedValue({ id: "123", username: "alice" });

            await expect(authService.register("alice", "password123"))
                .rejects
                .toThrow("Username already exists");
        });

        it("should hash password and create user when username is available", async () => {
            userRepository.getUser.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashed_secret");
            userRepository.createUser.mockResolvedValue({ id: "u1", username: "alice" });

            const result = await authService.register("alice", "password123");

            expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
            expect(userRepository.createUser).toHaveBeenCalledWith("alice", "hashed_secret");
            expect(result).toEqual({ id: "u1", username: "alice" });
        });
    });

    describe("login", () => {
        it("should throw Invalid Credentials if user not found", async () => {
            userRepository.getUser.mockResolvedValue(null);

            await expect(authService.login("nonexistent", "pass"))
                .rejects
                .toThrow("Invalid Credentials");
        });

        it("should throw Invalid Credentials if password does not match", async () => {
            userRepository.getUser.mockResolvedValue({ id: "u1", username: "alice", password: "hashed_password" });
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login("alice", "wrong_password"))
                .rejects
                .toThrow("Invalid Credentials");
        });

        it("should return user details and JWT token upon successful login", async () => {
            userRepository.getUser.mockResolvedValue({ 
                id: "u1", 
                username: "alice", 
                password: "hashed_password", 
                isSuperAdmin: false 
            });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mocked.jwt.token");

            const result = await authService.login("alice", "correct_password");

            expect(result).toEqual({
                id: "u1",
                username: "alice",
                token: "mocked.jwt.token"
            });
            expect(jwt.sign).toHaveBeenCalled();
        });
    });
});
