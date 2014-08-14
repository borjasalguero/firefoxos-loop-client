(function(exports) {
  'use strict';

  var wizardPanel, wizardLogin;

  function _showSection(section) {
    if (!section || !section.length || section.length === 0) {
      return;
    }

    var nextScreen = document.querySelector('#wizard-tutorial-section');
    nextScreen.classList.add('current');
  }

  var Wizard = {
    init: function w_init(isFirstUse) {

      document.body.dataset.layout = 'wizard';

      wizardPanel = document.getElementById('wizard-panel');
      wizardLogin = document.getElementById('wizard-login');

      // If  we have alreday seen the FTU we will go to step 2
      if (!isFirstUse) {
        // If tutorial is done, let's authenticate!
        Authenticate.init();

        // Show the right panel
        // _showSection('authenticate');
        wizardPanel.dataset.step = 2;
        wizardPanel.classList.add('login');
        wizardLogin.classList.add('show');
        return;
      }

      Tutorial.init();
    }
  };

  exports.Wizard = Wizard;
}(this));
