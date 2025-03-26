using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Net.Core.InterfaceRepository
{
    public interface IRepository<T>
    {
        Task<List<T>> GetAllAsync();

        Task<T> GetByIdAsync(int id);

        Task<T> AddAsync(T entity);

        Task<T> UpdateAsync(int id, T entity);

        Task DeleteAsync(T entity);
    }
}
