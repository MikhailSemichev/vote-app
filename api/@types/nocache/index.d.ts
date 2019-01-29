declare module 'nocache' {
    import express = require('express');

    function nocache(): express.RequestHandler;

    export = nocache;
}