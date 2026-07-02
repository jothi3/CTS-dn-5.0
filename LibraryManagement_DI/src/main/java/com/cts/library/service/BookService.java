package com.cts.library.service;

import com.cts.library.repository.BookRepository;

public class BookService {

    private BookRepository bookRepository;

    // Setter Injection
    public void setBookRepository(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public void issueBook() {
        System.out.println("Book issued.");
        bookRepository.showBook();
    }

}