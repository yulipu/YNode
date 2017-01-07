/**
 * @author yu
 * @license http://www.apache.org/licenses/LICENSE-2.0
 */
'use strict';

var CoreResponse = require('../core/Response');

/**
 * Web HTTP response
 */
class Response extends CoreResponse {
    
    /**
     * constructor
     */
    constructor(response) {
        super(response);
        
        /**
         * @var String HTTP protocol version
         */
        this.version = '1.1';
        
        /**
         * @var Integer the HTTP status code
         */
        this.statusCode = 200;
        
        /**
         * @var String the HTTP status description that comes together with the status code.
         * @see httpStatuses
         */
        this.statusText = 'OK';
        
        /**
         * @var JSON HTTP headers
         */
        this.headers = null;
        
        /**
         * @var String|Buffer HTTP content
         */
        this.content = '';
    }
    
    /**
     * @inheritdoc
     */
    send() {
        this.sendHeaders();
        this.sendContent();
        
        this.response.end();
        
        return this;
    }
    
    /**
     * 发送 header
     */
    sendHeaders() {
        this.response.writeHead(this.statusCode, this.statusText);
        
        if(null !== this.headers) {
            for(let name in this.headers) {
                this.response.setHeader(name, this.headers[name]);
            }
        }
    }
    
    /**
     * 发送内容
     */
    sendContent() {
        this.response.write(this.content);
    }
    
    /**
     * 得到 http status code
     */
    getStatusCode() {
        return this.statusCode;
    }
    
    /**
     * 设置 http status code
     *
     * @param Integer value the status code
     * @param String text the status text
     */
    setStatusCode(value, text) {
        if(value < 100 || value >= 600) {
            throw new RangeError('The HTTP status code is invalid');
        }
        
        this.statusCode = value;
        
        if(undefined === text) {
            this.statusText = undefined !== Response.httpStatuses[value] ?
                Response.httpStatuses[value] : '';
                
        } else {
            this.statusText = text;
        }
    }
}

/**
 * @var JSON list of HTTP status codes and the corresponding texts
 */
Response.httpStatuses = {
    // Informational
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '118': 'Connection timed out',
    
    // Success
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '210': 'Content Different',
    '226': 'IM Used',
    
    // Redirection
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Reserved',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',
    '310': 'Too many Redirect',
    
    // Client error
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Time-out',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Request Entity Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested range unsatisfiable',
    '417': 'Expectation failed',
    '418': 'I\'m a teapot',
    '422': 'Unprocessable entity',
    '423': 'Locked',
    '424': 'Method failure',
    '425': 'Unordered Collection',
    '426': 'Upgrade Required',
    '428': 'Precondition Required',
    '429': 'Too Many Requests',
    '431': 'Request Header Fields Too Large',
    '449': 'Retry With',
    '450': 'Blocked by Windows Parental Controls',
    
    // Server error
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway or Proxy Error',
    '503': 'Service Unavailable',
    '504': 'Gateway Time-out',
    '505': 'HTTP Version not supported',
    '507': 'Insufficient storage',
    '508': 'Loop Detected',
    '509': 'Bandwidth Limit Exceeded',
    '510': 'Not Extended',
    '511': 'Network Authentication Required'
};

module.exports = Response;