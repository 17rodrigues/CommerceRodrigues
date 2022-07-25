'use strict';

/**
 * @namespace Newsletter
 */

var server = require('server');

var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');


/**
 * Newsletter-Landing : This endpoint is called to load Newsletter landing page
 * @name Base/Newsletter-Landing
 * @function
 * @memberof Newsletter
 * @param {middleware} - server.middleware.https
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get(
    'Show', server.middleware.https, function (req, res, next) {
    var actionUrl = URLUtils.url('Newsletter-Subscribe');


    
    
  //  var newsletterform = server.forms.getForm('Newsletter'); //Buscar a variavel

  //  newsletterform.clear();

    res.render('newsletter/newsletter', {
        actionUrl: actionUrl
      
    });

    next();
});

/**
 * Newsletter-Subscribe : This endpoint is called to submit the shopper's Newsletter information
 * @name Base/Newsletter-Subscribe
 * @function
 * @memberof Newsletter
 * @param {middleware} - server.middleware.https
 * @param {httpparameter} - contactFirstName - First Name of the shopper
 * @param {httpparameter} - contactLastName - Last Name of the shopper
 * @param {httpparameter} - contactEmail - Email of the shopper
 * @param {httpparameter} - contactComment - Comments entered by the shopper
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.post('Subscribe', server.middleware.https, function (req, res, next) {

    var newsletterform = server.forms.getForm('Newsletter');
    var continueUrl = URLUtils.url('Newsletter-Show');

    if (newsletter.valid) {
        var transation = require('dw/system/Transaction');

        try {
            transaction.wrap(function () {
                var customObjectMgr = require('dw/object/CustomObjectMgr'); // criar manage objecto
                var co = customObjectMgr.createCustomObject('newsletterSign', newsletterform.email.value);
                co.custom.firstName = newsletterform.fname.value;
                co.custom.lastName = newsletterform.lname.value;
                res.render('newsletter/newsletterSucess', {
                    continueUrl: continueUrl,
                    newsletterform: newsletterform

                });

            });


        } catch (error) {
            var erro = error;
            res.render('newsletter/newsletterError', {
                errorMsg: "Erro ao Subscrever",
                continueUrl: continueUrl
            });
        }
    } else {
        res.render('newsletter/newsletterError', {
            errorMsg: "Erro ao Subscrever",
            continueUrl: continueUrl
        });
    }

    next();
});

module.exports = server.exports();
