
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Web.Net.Core.InterfaceRepository;

namespace Web.Net.Data.Repositories
{
    public class Repository<T>(DataContext context) : IRepository<T> where T : class
    {
        private readonly DataContext _context = context;
        private readonly DbSet<T> _dbSet = context.Set<T>();

        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<T> UpdateAsync(int id,T entity)
        {
            _dbSet.Update(entity); 
            await _context.SaveChangesAsync(); 
            return entity;
        }
    }
}
