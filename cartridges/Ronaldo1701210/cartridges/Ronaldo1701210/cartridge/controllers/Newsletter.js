'use strict';

var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var URLUtils = require('dw/web/URLUtils');

server.get(
    'Show',
    server.middleware.https,
    csrfProtection.generateToken,
    function (req, res, next) {
        var actionUrl = dw.web.URLUtils.url('Newsletter-Handler');
        var newsletterForm = server.forms.getForm('Newsletter');
        newsletterForm.clear();

        res.render('/newsletter/newsletter', {
            actionUrl: actionUrl,
            newsletterForm: newsletterForm
        });

        next();
    }
);

server.post(
    'Handler',
    server.middleware.https,csrfProtection.validateAjaxRequest,
    function (req, res, next) {
    	var newsletterForm = server.forms.getForm('Newsletter');
    	var continueUrl = URLUtils.url('Newsletter-Show');


    	if (newsletterForm.valid) {
            var Transaction = require('dw/system/Transaction');
    		try {
                Transaction.wrap(function(){
                    var CustomObjectMgr = require('dw/object/CustomObjectMgr');
                    var co = CustomObjectMgr.createCustomObject('NewsletterSubscription', newsletterForm.email.value);
                    co.custom.firstName = newsletterForm.fname.value;
                    co.custom.lastName = newsletterForm.lname.value;
                    res.render('/newsletter/newsletterSucess',{
                        continueUrl: continueUrl,
                     
                        newsletterForm: newsletterForm
                    });
                });
            }catch(e){
                var err = e;
                res.render('/newsletter/newsletterError', {
                    errorMsg: "Erro ao Subscrever",
                    continueUrl: continueUrl
                });
            }
        }else{
            res.render('/newsletter/newsletterError', {
                errorMsg: "Erro ao Subscrever",
            continueUrl: continueUrl
            });
        }
        next();
    }
);



module.exports = server.exports();