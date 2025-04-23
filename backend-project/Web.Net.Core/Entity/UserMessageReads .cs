using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.Entity
{
    [Table("UserMessageReads")]
    public class UserMessageReads
    {
        public int UserId { get; set; }

        public int MessageId { get; set; }
    }
}
