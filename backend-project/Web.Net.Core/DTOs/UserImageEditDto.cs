﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.DTOs
{
    public class UserImageEditDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int EditCount { get; set; } = 0;
    }
}
