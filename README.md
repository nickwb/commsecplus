# commsecplus
A chrome extension providing enhancements to CommSec.

## Early Days
Hello traveller! This is a *very* young project. It is not ready for use by end users. Developers looking to contribute are encouraged to get in touch.

## Vision
The vision of commsecplus is to augment the standard CommSec experience with a handful of useful analytical tools, making it easier for the trader to make an informed decision about a security.

## Roadmap
Check out the [milestones](https://github.com/nickwb/commsecplus/issues/milestones) to see planned features

## A note on security
Permitting an extension to access pages on CommSec is an inherently risky business. A malicious extension could send your passwords, personal information and/or portfolio information to a third party - or could even execute trades on your account without your knowledge. It is very important that you have full trust in any extension which you permit to access CommSec.

Why should you trust **commsecplus**?
* The full source code is available here on github for you to review.
* Unfortunately it has not been independently audited, because that is expensive and this is a personal project.
* You have the ability to disable any features which you feel uncomfortable using.
* All contributions will be vetted against the [Contribution Guidelines](#contribution-guidelines)

## Contribution Guidelines
If you'd like to contribute, please feel welcome to submit a pull request. You will need to meet the following guidelines:

* No code shall read/edit a form input containing a Client Id or Password
* Transmitting data to third parties:
    * It is generally not permissible for any code to transmit any data to a third party website or server
    * The following data may **never** be transmitted to a third party website: Client Id, Password, Personal Information, Account Information, Portfolio Details (i.e. Holdings), Alert Settings, Conditional Trigger Settings, Transaction History, Confirmations, and any other private investor information or settings.
    * It is permissible for an **ASX Code** to be transmitted to a third party website, but with the following conditions:
        * The website should be reputable, and preferably accessible via HTTPS
        * The website should be publicly accessible at no cost
        * The website should provide a service to the investor: For example, it could provide quotations on international stocks or indices.
        * No data regarding the investors purchase price or held quantity shall be transmitted
* All high-level functions should be able to be enabled/disabled from the options menu. If a function is disabled, all of its related computations, events, data collection and data storage should be prevented.
* Local storage of private information:
    * There is value in holding a local cache of portfolio holdings.
    * This is yet to be developed, but will probably become a necessity.
    * All best efforts will be made to protect this cache when the user is logged out.
    * Probably: encrypt local storage and bind to a client id. Perhaps have a "commsecplus password".