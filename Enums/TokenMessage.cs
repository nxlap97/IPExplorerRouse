using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Rousesite_Umbraco.Enums
{
    public enum TokenMessage
    {
        Success = 0,
        UsernameNotExist = 1,
        TokenIsInCorrect = 2,
        TokenHasExpired = 3
    }
}